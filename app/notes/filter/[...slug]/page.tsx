import { fetchNotes } from '@/lib/api';
import NotesClient from '@/app/notes/Notes.client';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

async function FilteredNotesPage({ params }: FilteredNotesPageProps) {
  const { slug } = await params;

  const filterValue = slug?.[0];

  if (!filterValue) {
    notFound();
  }

  const tag: NoteTag | undefined =
    filterValue === 'all'
      ? undefined
      : NOTE_TAGS.includes(filterValue as NoteTag)
        ? (filterValue as NoteTag)
        : notFound();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, '', 1],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}

export default FilteredNotesPage;
