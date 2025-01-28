interface ChannelIdPageProps {
  params: {
    channelId: string;
  };
}

// The page will share 'workspaceId' route's layout

async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const { channelId } = await params;

  return <div className="p-2">Channel Id: {channelId} </div>;
}

export default ChannelIdPage;
