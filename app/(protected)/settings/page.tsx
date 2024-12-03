import CustomerPortalForm from "@/components/payments/customer-portal-form";
import {
  getUser,
  getUserDetails,
  getSubscription,
} from "@/lib/supabase/queries";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AccountForm from "@/components/account-form";
import ChangePasswordForm from "@/components/change-password-form";

export default async function Account() {
  const [user, user_details, subscription] = await Promise.all([
    await getUser(),
    await getUserDetails(),
    await getSubscription(),
  ]);

  return (
    <div className="w-2/3 mx-auto">
      <Tabs defaultValue="account">
        <div className="flex items-center my-8">
          <TabsList className="">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="account">
          <AccountForm
            user={user}
            profile={{ full_name: user_details?.full_name! }}
          />
        </TabsContent>
        <TabsContent value="billing">
          <div className="max-w-6xl px-4 mx-auto sm:px-6 sm:pt-24 lg:px-8">
            <div className="sm:align-center sm:flex sm:flex-col">
              <p className="max-w-2xl mx-auto text-xl text-secondary sm:text-center sm:text-2xl">
                We partnered with Stripe for a simplified billing.
              </p>
            </div>
          </div>
          <CustomerPortalForm subscription={subscription} />
        </TabsContent>
        <TabsContent value="change-password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
