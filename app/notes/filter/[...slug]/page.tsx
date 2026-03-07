import { fetchNotes } from '@/lib/api';
import NotesClient from '@/app/notes/filter/[...slug]/Notes.client';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

const PER_PAGE = 12;

async function FilteredNotesPage({ params }: FilteredNotesPageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const filterValue = slug?.[0];

  if (!filterValue) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: '',
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  const tag: NoteTag | undefined =
    filterValue === 'all'
      ? undefined
      : NOTE_TAGS.includes(filterValue as NoteTag)
        ? (filterValue as NoteTag)
        : notFound();

  await fetchNotes({ page: 1, perPage: 12, search: '', tag });

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient />
    </HydrationBoundary>
  );
}

export default FilteredNotesPage;
