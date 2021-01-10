type TRANSPORTER_DATA = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export { TRANSPORTER_DATA };
