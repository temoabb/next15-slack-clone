interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdPage: React.FC<WorkspaceIdPageProps> = ({ params }) => {
  const { workspaceId } = params;

  return <div>ID: {workspaceId}</div>;
};

export default WorkspaceIdPage;
