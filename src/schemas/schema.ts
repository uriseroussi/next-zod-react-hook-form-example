import { z } from 'zod';

enum Titles {
  MR = 'Mr.',
  MS = 'Ms.',
  DR = 'Dr.',
}

export const titleOptions = Object.values(Titles);

export const formSchema = z
  .object({
    title: z.nativeEnum(Titles, {
      errorMap: () => {
        return { message: 'Please choose an option' };
      },
    }),
    firstName: z
      .string()
      .min(2, { message: 'First name must be more than 1 character' }),
    middleName: z
      .string()
      .refine(
        (middleName) => {
          if (middleName !== '' && middleName.length < 2) return false;
          return true;
        },
        { message: 'Middle name must be more than 1 character' }
      )
      .transform((middleName) => (middleName === '' ? null : middleName)),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be more than 1 character' }),
    email: z.string().email(),
    birthDate: z.string().pipe(z.coerce.date()),
    website: z.string().url(),
    phone: z.string().refine(
      (phone) => {
        const sections = phone.split('-');
        if (
          sections.length !== 3 ||
          sections[0].length !== 3 ||
          sections[1].length !== 3 ||
          sections[2].length !== 4
        ) {
          return false;
        }
        return true;
      },
      { message: 'Phone number must be xxx-xxx-xxxx' }
    ),
    profileImage: z
      .custom<FileList>()
      .transform((val) => {
        if (val instanceof File) return val;
        if (val instanceof FileList) return val[0];
        return null;
      })
      .superRefine((file, ctx) => {
        if (!(file instanceof File)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            fatal: true,
            message: 'Please provide an image file',
          });

          return z.NEVER;
        }

        if (file.size > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Max file size allowed is 5MB',
          });
        }

        if (
          !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
            file.type
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'File must be an image (jpeg, jpg, png, webp)',
          });
        }
      })
      .pipe(z.custom<File>()),
    password: z.string().refine(
      (val) => {
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          val
        );
      },
      {
        message:
          'Password must be at least 8 characters long and contain at least one uppercase character, one lowercase character, and one special symbol',
      }
    ),
    confirmPassword: z.string(),
    subscribe: z.coerce.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export type FormSchemaInputType = z.input<typeof formSchema>;
export type FormSchemaOutputType = z.output<typeof formSchema>;
