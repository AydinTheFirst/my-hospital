// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/dashboard/appointments`
  | `/dashboard/appointments/:appointmentId`
  | `/dashboard/doctors`
  | `/dashboard/doctors/:doctorId`
  | `/dashboard/notes`
  | `/dashboard/notes/:noteId`
  | `/dashboard/professions`
  | `/dashboard/professions/:professionId`
  | `/dashboard/users`
  | `/dashboard/users/:userId`
  | `/login`
  | `/randevular`
  | `/register`;

export type Params = {
  "/dashboard/appointments/:appointmentId": { appointmentId: string };
  "/dashboard/doctors/:doctorId": { doctorId: string };
  "/dashboard/notes/:noteId": { noteId: string };
  "/dashboard/professions/:professionId": { professionId: string };
  "/dashboard/users/:userId": { userId: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
