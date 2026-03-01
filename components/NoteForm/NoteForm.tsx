import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import type { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required(),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as NoteTag }}
      validationSchema={validationSchema}
      onSubmit={values => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label>Title</label>
          <Field className={css.input} name="title" />
          <ErrorMessage className={css.error} name="title" component="span" />
        </div>

        <div className={css.formGroup}>
          <label>Content</label>
          <Field as="textarea" name="content" rows={8} className={css.textarea} />
          <ErrorMessage className={css.error} name="content" component="span" />
        </div>

        <div className={css.formGroup}>
          <label>Tag</label>
          <Field as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage className={css.error} name="tag" component="span" />
        </div>
        <div className={css.actions}>
          <button className={css.cancelButton} type="button" onClick={onClose}>
            Cancel
          </button>

          <button className={css.submitButton} type="submit" disabled={mutation.isPending}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
