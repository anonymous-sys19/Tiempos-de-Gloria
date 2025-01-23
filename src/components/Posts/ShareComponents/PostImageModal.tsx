/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function PostImageModal({ isOpen, setIsOpen, imageUrl }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <img src={imageUrl} alt="Imagen" className="rounded-md w-full" />
            </DialogContent>
        </Dialog>
    );
}
