export type DefaultResponse = {
  message: string;
  errorCode?: string;
};


export type publicGroupSchema = {
  id: number,
  coordinates: {
    latitude: number,
    longitude: number
  }
  profileImage: string,
  name: string
};