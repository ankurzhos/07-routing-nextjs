import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

const NotePreview = async ({ params }: NotePreviewProps) => {
  const { id } = await params;
  const note = await fetchNoteById(id);

  if (!note) return;

  return (
    <>
      <Modal>
        <NoteDetailsClient />
      </Modal>
    </>
  );
};

export default NotePreview;
