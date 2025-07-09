import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import axiosInstance from "@/config/axios.config"
import { Plus } from "lucide-react"
import { useRef, useState } from "react"

const NewDirectMessage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [openSelectContactModal, setOpenSelectContactModal] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const searchContacts = (searchTerm: string) => {

        if (searchTerm.trim().length === 0) {
            setSearchedContacts([]);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.post('api/v1/chat/search', { searchTerm });
                setSearchedContacts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error searching contacts:", error);
                setSearchedContacts([]);
                setIsLoading(false);
            }
        }, 300);
    };

    async function selectNewContact(contact:any) {
        setOpenSelectContactModal(false);
        setSearchedContacts([]);
    }

    const userRole = "student"

  return (
    <>
    <Tooltip>
      <TooltipTrigger asChild>
        <Plus onClick={() => setOpenSelectContactModal(!openSelectContactModal)} className="h-4 w-4 cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>
        <p>New Message</p>
      </TooltipContent>
    </Tooltip>
    <Dialog open={openSelectContactModal} onOpenChange={setOpenSelectContactModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Please select a contact</DialogTitle>
          <DialogDescription>
            {
              userRole === "student" ? (
                <p>Select one of your enrolled tutors.</p>
              ) : (
                <p>Select one of your students.</p>
              )
            }
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-col items-center gap-2">
          <div className=" w-full">
            <Input
              id="search"
              placeholder="Search Contacts"
              className="h-9"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length > 0 && <ScrollArea className="h-[250px] w-full p-3">
            <div className="flex flex-col gap-5">
                {
                
                  searchedContacts.map((contact: any) => (
                    <div 
                        onClick={()=> selectNewContact(contact)}
                        className="flex gap-3 items-center justify-start cursor-pointer">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                            src={contact?.profileImage || "https://i.pravatar.cc/150?img=67"}
                            alt={contact?.userName || "User Avatar"}
                            className="object-cover shadow-[inset_0px_0px_25px_7px_rgba(9,_2,_9,_0.94)]"
                            />
                            <AvatarFallback 
                            className="text-4xl bg-gradient-to-br from-sky-400 to-blue-800 text-white font-bold"
                            >
                            {contact?.userName ? contact.userName.slice(0, 2).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-col items-center p-2 font-bold">
                            <span>{contact?.userName || contact?.userEmail}</span>
                            <p className="text-xs text-sky-300/35">{contact?.userEmail}</p>
                        </div>
                    </div>
                  ))
                }
            </div>
          </ScrollArea>}
          {isLoading ? (
            <p className="text-sm py-4 text-sky-300/35">Wait...</p>
            ):(
            searchedContacts.length <= 0 &&  (
              <p className="py-4 text-sm text-sky-300/35">✨Search for a contact✨</p>
            )) 
          }
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default NewDirectMessage