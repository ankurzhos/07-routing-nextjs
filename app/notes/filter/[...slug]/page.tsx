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

  let tag: NoteTag | undefined;
  if (filterValue === 'all') {
    tag = undefined;
  } else if (NOTE_TAGS.includes(filterValue as NoteTag)) {
    tag = filterValue as NoteTag;
  } else {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, '', 1],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: '',
        tag,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default FilteredNotesPage;
