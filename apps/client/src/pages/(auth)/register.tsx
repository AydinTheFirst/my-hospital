import { Button, CardFooter, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

import { CenteredCard } from "@/components";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/http";
import { sleep } from "@/utils";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());

    if (data.password !== data.confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      setIsLoading(false);
      return;
    }

    try {
      await http.post("/auth/register", data);
      toast.success("Hesabınız başarıyla oluşturuldu!");
      await sleep(1000);
      location.replace("/login");
    } catch (error) {
      http.handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <CenteredCard title="Register">
      <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
        <Input
          className="col-span-12"
          isRequired
          label="Email"
          name="email"
          type="email"
        />

        <Input
          className="col-span-12 md:col-span-6"
          isRequired
          label="İsim"
          name="firstName"
        />

        <Input
          className="col-span-12 md:col-span-6"
          isRequired
          label="Soyisim"
          name="lastName"
        />

        <Input
          className="col-span-12"
          isRequired
          label="T.C. Kimlik Numarası"
          name="nationalId"
        />

        <Input
          className="col-span-12"
          isRequired
          label="Doğum tarihi"
          name="birthDate"
          type="date"
        />

        <Input
          className="col-span-12"
          isRequired
          label="Telefon Numarası"
          name="phoneNumber"
          type="tel"
        />

        <PasswordInput className="col-span-12" />
        <PasswordInput
          className="col-span-12"
          label="Şifreyi Onayla"
          name="confirmPassword"
        />

        <Button
          className="col-span-12"
          color="primary"
          fullWidth
          isLoading={isLoading}
          type="submit"
        >
          Kayıt Ol
        </Button>
      </form>
      <CardFooter className="flex-col justify-center">
        <p>Zaten bir hesabınız var mı?</p>
        <Link href="/login">Giriş Yap</Link>
      </CardFooter>
    </CenteredCard>
  );
};

export default Register;
