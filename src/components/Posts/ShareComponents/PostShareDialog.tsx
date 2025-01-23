/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle } from 'lucide-react';

export default function PostShareDialog({ isOpen, setIsOpen, shareUrl }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Compartir publicación</DialogTitle>
                    <DialogDescription>Elige cómo deseas compartir esta publicación</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                    <Input value={shareUrl} readOnly />
                    <div className="flex space-x-2">
                        <Button onClick={() => navigator.clipboard.writeText(shareUrl)}>
                            <Copy /> Copiar enlace
                        </Button>
                        <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`¡Mira esta publicación! ${shareUrl}`)}`, '_blank')}>
                            <MessageCircle /> Compartir en WhatsApp
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
