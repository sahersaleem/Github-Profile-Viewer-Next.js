"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { ExternalLink, LocateIcon, RecycleIcon, UserIcon } from "lucide-react";

type UserProfile = {
  followers: number;
  following: number;
  avatar_url: string;
  location: string | null;
  name: string;
  bio: string;
  login: string;
  html_url: string;
};

type UserRepos = {
  name: string;
  html_url: string;
  id: number;
  description: string;
  stargazers_count: number;
  forks_count: number;
};

const GithubProfilePreviwer = () => {
  const [username, setUserName] = useState<string>("");
  const [userProfileResponse, setUserProfileResponse] =
    useState<UserProfile | null>(null);

  const [userProfileRepos, setUserProfileRepos] = useState<UserRepos[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const userProfile = await fetch(
        `https://api.github.com/users/${username}`
      );

      if (!userProfile.ok) {
        setError("Not found");
        return
      }
      const userProfileData = await userProfile.json();

      console.log(userProfileData);

      const userRepos = await fetch(
        `https://api.github.com/users/${username}/repos`
      );

      if (!userRepos.ok) {
        setError("Not found");
        return
      }
      const userProfileReposData = await userRepos.json();
      console.log(userProfileReposData);

      setUserProfileResponse(userProfileData);
      setUserProfileRepos(userProfileReposData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="max-w-3xl">
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-2xl">Github Profile Viewer</CardTitle>
          <CardDescription>
            Search for a GitHub username and view their profile and
            repositories, search like: SaherSaleem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {" "}
            <form onSubmit={handleSubmit} className="flex gap-5">
              <Input
                placeholder="Enter a github username"
                value={username}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
              <Button type="submit">{loading ? "loading.." : "Search"}</Button>
            </form>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <div className="mt-4">
              {userProfileResponse && (
                <div>
                  <div className="flex gap-5 justify-center items-center">
                    <div>
                      {" "}
                      <Avatar className="w-[100px] h-auto">
                        <AvatarImage src={userProfileResponse.avatar_url} />
                        <AvatarFallback>{username}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-bold">
                          {userProfileResponse.name}
                        </h1>
                        <Link
                          href={userProfileResponse.html_url}
                          target="_Blank"
                        >
                          <ExternalLink className="text-lg" />
                        </Link>
                      </div>

                      <p className="text-wrap">{userProfileResponse.bio}</p>

                      <div className="flex gap-3">
                        <div className="flex justify-center items-center">
                          <UserIcon />
                          {userProfileResponse.followers} followers
                        </div>
                        <div className="flex justify-center items-center">
                          <UserIcon />
                          {userProfileResponse.following} following
                        </div>

                        <div className="flex justify-center items-center">
                          <LocateIcon />
                          {userProfileResponse.location || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>


                <div className="mt-4"> <h1 className="text-2xl font-bold">Repositories</h1></div>
                  <div className="grid grid-cols-2 mt-4 gap-3">
                   
                    {userProfileRepos.map((repo) => (
                      <Card key={repo.id} className="shadow-lg">
                        <CardHeader>
                          <div>
                            <RecycleIcon /> <h1>{repo.name}</h1>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {repo.description || "no description"}
                        </CardContent>
                        <CardFooter>
                          <Link href={repo.html_url}>View on Github</Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GithubProfilePreviwer;
