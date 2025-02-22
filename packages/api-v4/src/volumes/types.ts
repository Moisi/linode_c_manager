export interface Volume {
  id: number;
  label: string;
  status: VolumeStatus;
  size: number;
  region: string;
  linode_id: null | number;
  linode_label: null | string;
  created: string;
  updated: string;
  filesystem_path: string;
  tags: string[];
  hardware_type: VolumeHardwareType;
}

type VolumeHardwareType = 'hdd' | 'nvme';

export type VolumeStatus =
  | 'creating'
  | 'active'
  | 'resizing'
  | 'deleting'
  | 'deleted'
  | 'migrating'
  | 'contact_support';

export interface VolumeRequestPayload {
  label: string;
  size?: number;
  region?: string;
  linode_id?: number;
  config_id?: number;
  tags?: string[];
}

export interface AttachVolumePayload {
  linode_id: number;
  config_id?: number;
}
export interface CloneVolumePayload {
  label: string;
}

export interface ResizeVolumePayload {
  size: number;
}

export interface VolumesMigrationQueue {
  volumes: number;
  linodes: number;
}

export interface MigrateVolumesPayload {
  volumes: number[];
}
