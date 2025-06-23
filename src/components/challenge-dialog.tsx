import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaceScanChallenge } from "@/components/face-scan-challenge";
import { RpsChallenge } from "@/components/rps-challenge";
import { MathChallenge } from "@/components/math-challenge";
import { Eye, Puzzle, Hand } from "lucide-react";

type ChallengeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeComplete: () => void;
};

export function ChallengeDialog({
  open,
  onOpenChange,
  onChallengeComplete,
}: ChallengeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-headline">Wake Up Challenge!</DialogTitle>
          <DialogDescription>
            Complete one of the challenges below to turn off the alarm.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Tabs defaultValue="rps" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rps">
                <Hand className="w-4 h-4 mr-2" />
                RPS Game
              </TabsTrigger>
              <TabsTrigger value="math">
                <Puzzle className="w-4 h-4 mr-2" />
                Math Quiz
              </TabsTrigger>
              <TabsTrigger value="face">
                <Eye className="w-4 h-4 mr-2" />
                Awake Check
              </TabsTrigger>
            </TabsList>
            <TabsContent value="rps" className="pt-4">
              <RpsChallenge onChallengeComplete={onChallengeComplete} />
            </TabsContent>
            <TabsContent value="math" className="pt-4">
              <MathChallenge onChallengeComplete={onChallengeComplete} />
            </TabsContent>
            <TabsContent value="face" className="pt-4">
              <FaceScanChallenge onChallengeComplete={onChallengeComplete} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
