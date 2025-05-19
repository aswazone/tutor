import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function PublishDraftToggle({isPublished, setIsPublished}: {isPublished: boolean, setIsPublished: (isPublished: boolean) => void}) {

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="publish-draft-toggle" className={`text-sm font-semibold ${isPublished ? "text-green-500" : "text-amber-300/70"}`}>
        {isPublished ? "Publish" : "Draft"}
      </Label>
      <Switch
      
        className="data-[state=checked]:bg-green-400/60"
        id="publish-draft-toggle"
        defaultChecked={isPublished}
        onCheckedChange={() => setIsPublished(!isPublished)}
      />
    </div>
  )
}
