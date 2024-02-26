'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from './Input';
import Select from './Select';
import {
  FormSchemaInputType,
  formSchema,
  titleOptions,
} from '@/schemas/schema';
import Checkbox from './Checkbox';

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaInputType>({
    resolver: zodResolver(formSchema, {}, { raw: true }),
    defaultValues: {
      subscribe: true,
    },
  });

  const onSubmit: SubmitHandler<FormSchemaInputType> = async (data) => {
    const formData = new FormData();

    for (const field of Object.keys(data) as Array<keyof typeof data>) {
      if (field === 'profileImage') {
        formData.append('profileImage', data.profileImage[0]);
      } else {
        formData.append(`${field}`, `${data[field]}`);
      }
    }

    await fetch('/api/v1/form', { body: formData, method: 'POST' });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:max-w-screen-lg"
    >
      <Select
        label="Title"
        options={titleOptions}
        {...register('title')}
        error={errors.title?.message}
        required
      />

      <Input
        label="First Name"
        {...register('firstName')}
        error={errors.firstName?.message}
        required
      />

      <Input
        label="Middle Name"
        {...register('middleName')}
        error={errors.middleName?.message}
      />

      <Input
        label="Last Name"
        {...register('lastName')}
        error={errors.lastName?.message}
        required
      />

      <Input
        label="Birth Date"
        {...register('birthDate')}
        type="date"
        error={errors.birthDate?.message}
        required
      />

      <Input
        label="Email"
        {...register('email')}
        type="email"
        error={errors.email?.message}
        required
      />

      <Input
        label="Phone Number"
        {...register('phone')}
        error={errors.phone?.message}
        required
      />

      <Input
        label="Website"
        {...register('website')}
        type="url"
        error={errors.website?.message}
        required
      />

      <Input
        label="Profile Image"
        {...register('profileImage')}
        type="file"
        error={errors.profileImage?.message}
        className="col-span-full"
        required
      />

      <Input
        label="New Password"
        {...register('password')}
        type="password"
        error={errors.password?.message}
        className="sm:col-span-2"
        required
      />

      <Input
        label="Confirm Password"
        {...register('confirmPassword')}
        type="password"
        error={errors.confirmPassword?.message}
        className="sm:col-span-2"
        required
      />

      <Checkbox
        label="Subscribe to Newsletter?"
        {...register('subscribe')}
        error={errors.subscribe?.message}
        className="col-span-full"
      />

      <button
        type="submit"
        className="col-span-full px-6 py-3 uppercase font-bold bg-green-500 hover:bg-green-400 rounded-sm transition-all shadow-md"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
