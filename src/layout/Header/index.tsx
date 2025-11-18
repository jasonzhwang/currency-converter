import { Session } from "next-auth";

const Header = ({ session }: { session: Session | null }) => {
  return <header>Header</header>;
};

export default Header;
