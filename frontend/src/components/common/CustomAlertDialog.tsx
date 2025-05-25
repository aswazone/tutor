import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Switch } from "../ui/switch"

export function CustomAlertDialog({buttonText,handleSubmit,isDisabled}:{buttonText:string,handleSubmit:()=>void,isDisabled?:boolean}) {
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button disabled={isDisabled} className="font-semibold me-3 border rounded-tl-none rounded-br-none bg-sky-950/10 text-sky-500/50 hover:text-sky-400/60 hover:bg-sky-950/30">{buttonText === "Submitting..." ? <Loader2 className="animate-spin" /> : buttonText}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-sky-600/40">
        <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold mb-3">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will submit your course for
            review and make sure that it is
              {
                <span className="text-green-500 inline-block p-2">
                  <span className="text-green-500 flex bg-accent py-0.5 px-1 rounded">Publish <Switch className="data-[state=checked]:bg-green-400/60 ml-1" checked={true}/></span>
                </span>
              }for visiblity !
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
