import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, X } from "lucide-react";

const MAX_SKILLS = 5;

const UserCard = ({ user, onPass, onSend }) => {
  if (!user) return null;

  const { _id, firstName = "", lastName = "", photoUrl, gender, about, skills = [] } = user;

  const fullName = `${firstName} ${lastName ?? ""}`.trim();
  const initials = `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  const shownSkills = skills.slice(0, MAX_SKILLS);
  const hiddenCount = skills.length - shownSkills.length;

  return (
    <Card className="mx-auto w-full max-w-sm gap-0 overflow-hidden p-0 shadow-2xl">
      {/* Photo + name overlay */}
      <div className="relative aspect-[4/5] w-full bg-muted">
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage src={photoUrl} alt={fullName} className="object-cover" />
          <AvatarFallback className="rounded-none bg-muted text-6xl font-extrabold text-muted-foreground">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h2 className="text-2xl font-extrabold leading-tight">{fullName}</h2>
          {gender && <p className="mt-0.5 text-sm capitalize text-white/80">{gender}</p>}
        </div>
      </div>

      {/* Bio + skills */}
      <CardContent className="space-y-4 px-5 pb-0 pt-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">About</p>
          {about ? (
            <p className="mt-1 line-clamp-4 text-base leading-relaxed">{about}</p>
          ) : (
            <p className="mt-1 text-base italic text-muted-foreground">No bio yet.</p>
          )}
        </div>

        {shownSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {shownSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1 text-sm font-semibold">
                {skill}
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-normal">
                +{hiddenCount} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="justify-center gap-3 px-5 pb-6 pt-6">
        <Button type="button" variant="outline" onClick={() => onPass?.(_id)} className="h-[50px] rounded-full px-6">
          <X className="h-5 w-5" />
          Pass
        </Button>
        <Button type="button" onClick={() => onSend?.(_id)} className="h-[50px] rounded-full px-6">
          <Heart className="h-5 w-5 fill-current" />
          Send request
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UserCard;
