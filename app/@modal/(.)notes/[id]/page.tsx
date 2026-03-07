import { fetchNoteById } from '@/lib/api';
import NotePreviewClient from './NotePreview.client';

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

const NotePreview = async ({ params }: NotePreviewProps) => {
  const { id } = await params;
  const note = await fetchNoteById(id);

  if (!note) return null;

  return (
    <>
      <NotePreviewClient />
    </>
  );
};

export default NotePreview;
