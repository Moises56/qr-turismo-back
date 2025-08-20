import { SuscripcionLocal } from '@prisma/client';

export class SuscripcionLocalEntity implements SuscripcionLocal {
  id: string;
  nombreLocal: string | null;
  tipoLocal: string | null;
  latitud: string | null;
  longitud: string | null;
  direccion: string | null;
  rtnDni: string | null;
  permisoOperacion: string | null;
  telefonoLocal: string | null;
  nombrePropietario: string | null;
  telefonoPropietario: string | null;
  email: string | null;
  urlWeb: string | null;
  urlWhatsapp: string | null;
  urlTiktok: string | null;
  urlInstagram: string | null;
  urlFacebook: string | null;
  urlX: string | null;
  registroNacionalTurismo: string | null;
  urlImagenRegistroTurismo: string | null;
  status: string | null;
  tipoLocalId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
