import { ProfileHeader } from "@/components/profile/profile-header";
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, first_name, last_name, username, avatar_url, bio")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError);
    notFound();
  }

  const { count: followerCount } = await supabase
    .from("author_follows")
    .select("*", { count: "exact", head: true })
    .eq("author_id", profile.id);

  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", profile.id)
    .eq("status", "published");

  const isCurrentUser = user?.id === profile.id;

  let isFollowing = false;

  if (user && !isCurrentUser) {
    const { data: followData } = await supabase
      .from("author_follows")
      .select("author_id")
      .eq("follower_id", user.id)
      .eq("author_id", profile.id)
      .maybeSingle();

    isFollowing = !!followData;
  }

  const normalizedProfile = {
    id: profile.id,
    name: profile.name,
    first_name: profile.first_name,
    last_name: profile.last_name,
    username: profile.username,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    follower_count: followerCount ?? 0,
    post_count: postCount ?? 0,
    isCurrentUser: true,
    isFollowing,
  };

  return <ProfileHeader profile={normalizedProfile} />;
}
