import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XBOX_AVATARS } from '@/lib/avatars';

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarSelect: (avatar: string) => void;
  trigger?: React.ReactNode;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarSelect,
  trigger
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (avatar: string) => {
    onAvatarSelect(avatar);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Cambiar Avatar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selecciona tu Avatar</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-8 gap-4 p-4">
            {XBOX_AVATARS.map((avatar, index) => (
              <Button
                key={index}
                variant={currentAvatar === avatar ? "default" : "outline"}
                className="h-16 w-16 text-2xl hover:scale-110 transition-transform"
                onClick={() => handleSelect(avatar)}
              >
                {avatar}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};