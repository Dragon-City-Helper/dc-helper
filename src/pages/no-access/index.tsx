export function getStaticProps() {
  return { props: {} };
}
export default function noAccess() {
  return (
    <h2 className="flex justify-center items-center text-2xl">
      You do not have access to this page
    </h2>
  );
}
