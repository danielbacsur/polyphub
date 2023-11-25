import { getUser } from "@/lib/fetchers";

export default async function WorkspacesPage() {
  const user = await getUser();

  return (
    <div>
      Hello from dashboard! {user.name} {user.email}
      <img src={user.image} />
    </div>
  );
}
