import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, X } from "lucide-react";

const MAX_SKILLS = 5;


const UserCard = ({
  user,
  onPass,
  onSend,
  showActions = true,
  compact = false,
}) => {
  if (!user) return null;

  const {
    _id,
    firstName = "",
    lastName = "",
    photoUrl,
    gender,
    age,
    about,
    skills = [],
  } = user;

  const fullName = `${firstName} ${lastName ?? ""}`.trim();
  const initials = `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  const maxSkills = compact ? 4 : MAX_SKILLS;
  const shownSkills = skills.slice(0, maxSkills);
  const hiddenCount = skills.length - shownSkills.length;

  return (
    <Card
      className={`mx-auto w-full max-w-sm gap-0 overflow-hidden p-0 shadow-2xl ${
        compact ? "h-full" : ""
      }`}
    >
      {/* Photo + name overlay */}
      <div
        className={`relative w-full overflow-hidden bg-muted ${
          compact ? "min-h-0 flex-1" : "aspect-[4/5]"
        }`}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName}
            draggable={false}
            className="h-full w-full select-none object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-6xl font-extrabold text-muted-foreground">
            {initials || "?"}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div
          className={`absolute inset-x-0 bottom-0 text-white ${compact ? "p-4" : "p-5"}`}
        >
          <h2
            className={`font-extrabold leading-tight ${compact ? "text-xl" : "text-2xl"}`}
          >
            {fullName}
            {age != null && `, ${age}`}
          </h2>

          {gender && (
            <p className="mt-0.5 text-sm capitalize text-white/80">{gender}</p>
          )}
        </div>
      </div>

      {/* Bio + skills */}
      <CardContent
        className={
          compact
            ? "shrink-0 space-y-3 px-4 pb-0 pt-4"
            : "space-y-4 px-5 pb-0 pt-5"
        }
      >
        <div>
          <p className="text-xs font-medium text-muted-foreground">About</p>
          {about ? (
            <p
              className={`mt-1 leading-relaxed ${
                compact ? "line-clamp-2 text-sm" : "line-clamp-4 text-base"
              }`}
            >
              {about}
            </p>
          ) : (
            <p
              className={`mt-1 italic text-muted-foreground ${
                compact ? "text-sm" : "text-base"
              }`}
            >
              No bio yet.
            </p>
          )}
        </div>

        {shownSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {shownSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className={`rounded-full font-semibold ${
                  compact ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
                }`}
              >
                {skill}
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <Badge
                variant="outline"
                className={`rounded-full font-normal ${
                  compact ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
                }`}
              >
                +{hiddenCount} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardFooter
          className={`justify-center gap-3 ${
            compact ? "shrink-0 px-4 pb-4 pt-4" : "px-5 pb-6 pt-6"
          }`}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => onPass?.(_id)}
            className={`rounded-full ${compact ? "h-11 px-5" : "h-[50px] px-6"}`}
          >
            <X className="h-5 w-5" />
            Pass
          </Button>

          <Button
            type="button"
            onClick={() => onSend?.(_id)}
            className={`rounded-full ${compact ? "h-11 px-5" : "h-[50px] px-6"}`}
          >
            <Heart className="h-5 w-5 fill-current" />
            Send request
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserCard;
