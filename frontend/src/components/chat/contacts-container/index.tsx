import NewDirectMessage from "./NewDirectMessage"
import ProfileInfo from "./profile-info"


const Title = ({text}: {text: string}) => {
  return (
    <h6 className="uppercase text-neutral-400 tracking-widest pl-8 font-['Poppins'] font-light text-sm">{text}</h6>
  )
}

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[30vw] xl:w-[25vw] bg-[#071e28f7] border-r-2 border-[#062837f7] w-full">
        <div className="p-4 text-2xl font-semibold text-[#3f8cb5eb]">
            Messages
        </div>
        <div className="my-3">
            <div className="flex items-center justify-between pr-8">
                <Title text="Direct Messages" />
                <NewDirectMessage />
            </div>
        </div>
        <div className="my-3">
            <div className="flex items-center justify-between pr-8">
                <Title text="Channels" />
            </div>
        </div>
        <ProfileInfo />
    </div>
  )
}

export default ContactsContainer