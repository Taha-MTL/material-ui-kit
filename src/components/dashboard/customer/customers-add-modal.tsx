'use client';

import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import type { Customer } from '@/components/dashboard/customer/customers-table';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Customer, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  address: Yup.object().shape({
    city: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    street: Yup.string().required('Required'),
  }),
});

const initialValues: Customer = {
  id: '',
  name: '',
  avatar: '',
  email: '',
  phone: '',
  address: {
    city: '',
    country: '',
    state: '',
    street: '',
  },
  createdAt: new Date(),
};

export default function CustomerModal({ open, onClose, onSubmit }: CustomerModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Customer</DialogTitle>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Name"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
                margin="normal"
              />
              {/* ... other fields ... */}
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
