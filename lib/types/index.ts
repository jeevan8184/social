import { IMessage } from "../database/models/Message.model"

export type SignInProps ={
    email:string,
    password:string,
}

export type SignUpProps={
    email:string,
    username:string,
    password:string,
    confirmPassword:string
}

export type CreateUserParams={
    username:string,
    bio:string,
    photo:string,
    path:string
}

export type fetchUserProps={
    limit:number,
    page:number,
    query:string,
    path:string
}

export type formUrlParams={
    params:string,
    key:string,
    value:string | null
}

export type RemoveUrlQueryParams={
    params:string,
    keysToRemove:string[]
}

export type searchParamsProps={
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export type SessionParams={
    authId:string,
    expiresAt:Date,
    token:string
}

export type addFriendParams={
    userId:string,
    path:string
}

export type createMessageParams={
    text?:string | null,
    senderId:string,
    receiverId:string,
    path:string,
    image?:string | null,
}

export type createMessagePostParams={
    text?:string | null,
    senderId:string,
    receiverId:string,
    path:string,
    image?:string | null,
    post:string | null
}

export type createChatParams={
    senderId:string,
    receiverId:string
}

export type getChatWithIdParams={
    chatId:string,
    sender:string
}

export type INotify={
    newMsg:IMessage,
    senderId:string,
    receiverId:string,
    name:string,
    isRead:boolean,
    date:Date
}

export type IOnlineUsers={
    userId:string,
    socketId:string,
    isTyping:boolean
}

export type addReactionsMsgParams={
    userId:string,
    emoji:string,
    id:string
}

export type createPostParams={
    creator:string,
    text?:string,
    images?:Array<string>,
    tags?:Array<string>,
    path?:string
}

export type getAllUserPostsParams={
    userId:string,
    limit?:number,
    page?:number | string,
    path:string
}

export type getAllPostsParams={
    limit?:number,
    page?:number | string,
    path:string;
}

export type addLikeToPostParams={
    userId:string,
    postId:string,
    path:string
}

export type createCommentParams={
    postId:string,
    userId:string,
    text:string,
    path:string
}

export type deleteCommentParams={
    id:string,
    postId:string,
    path:string
}

export type addLikeToCommentParams={
    id:string,
    userId:string,
    path:string
}

export type updateCommentParams={
    id:string,
    text:string,
    path:string
}

export type ReplyCommentParams={
    userId:string,
    text:string,
    path:string,
    commentId:string
}

export type deleteChildCmtParams={
    id:string,
    path:string,
    cmtId:string
}