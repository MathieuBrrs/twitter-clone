import Tweet from "./Tweet";

function TweetList({ tweets, onDelete, onLike, currentUser }) {
  if (!tweets.length) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Aucun tweet pour le moment. Écris le premier !
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          onDelete={onDelete}
          onLike={onLike}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}

export default TweetList;
