
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
  } from 'react-icons/hi';
  import { Button, Table } from 'flowbite-react';
  import { Link } from 'react-router-dom';

export default function DashboardComp() {

  
    const API_URL = import.meta.env.VITE_API_URL;

    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    const { currentUser } = useSelector((state) => state.user);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
              const res = await fetch(`${API_URL}/api/user/getusers?limit=5`);
              const data = await res.json();
              if (res.ok) {
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setLastMonthUsers(data.lastMonthUsers);
              }
            } catch (error) {
              console.log(error.message);
            }
          };
          const fetchPosts = async () => {
            try {
              const res = await fetch(`${API_URL}/api/post/getposts?limit=5`);
              const data = await res.json();
              if (res.ok) {
                setPosts(data.posts);
                setTotalPosts(data.totalPosts);
                setLastMonthPosts(data.lastMonthPosts);
              }
            } catch (error) {
              console.log(error.message);
            }
          };
          const fetchComments = async () => {
            try {
              const res = await fetch(`${API_URL}/api/comment/getcomments?limit=5`);
              const data = await res.json();
              if (res.ok) {
                setComments(data.comments);
                setTotalComments(data.totalComments);
                setLastMonthComments(data.lastMonthComments);
              }
            } catch (error) {
              console.log(error.message);
            }
          };

        if (currentUser.rest.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
          }
    },[currentUser]);

    return (
        <div className='p-3 md:mx-auto'>
          <h1 className='text-4xl font-semibold p-3 mt-5 mb-5 text-start'>
          Your story stats
          </h1>
          <div className='flex flex-row gap-4 justify-left'>
            <div className='flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Subscriber</h3>
                  <p className='text-2xl'>{totalUsers}</p>
                </div>
                <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex  gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                  <HiArrowNarrowUp />
                  {lastMonthUsers}
                </span>
                <div className='text-gray-500'>Last month</div>
              </div>
            </div>
            <div className='flex flex-col p-3 bg-white dark:bg-slate-800 gap-4  w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>
                    Total Comments
                  </h3>
                  <p className='text-2xl'>{totalComments}</p>
                </div>
                <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex  gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                  <HiArrowNarrowUp />
                  {lastMonthComments}
                </span>
                <div className='text-gray-500'>Last month</div>
              </div>
            </div>
            <div className='flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                  <p className='text-2xl'>{totalPosts}</p>
                </div>
                <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex  gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                  <HiArrowNarrowUp />
                  {lastMonthPosts}
                </span>
                <div className='text-gray-500'>Last month</div>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md bg-white dark:border-gray-700 dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent Subscriber</h1>
              </div>
              <Table hoverable>
                {users &&
                  users.map((user) => (
                    <Table.Body key={user._id} className='divide-y'>
                      <Table.Row className=' dark:bg-gray-800'>
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt='user'
                            className='w-10 h-10 rounded-full bg-gray-500'
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
              <Button color="gray" pill>
              <Link to={'/dashboard?tab=users'}>See all</Link>
               </Button>
       
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md bg-white border dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Latest comments</h1>
              </div>
              <Table hoverable>

                {comments &&
                  comments.map((comment) => (
                    <Table.Body key={comment._id} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell className='w-96'>
                            <p className='line-clamp-2'>{comment.content}</p>
                        </Table.Cell>
                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
              <Button color="gray" pill>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
              </Button>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md bg-white dark:border-gray-700 dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent posts</h1>
              </div>
              <Table hoverable>

                {posts &&
                  posts.map((post) => (
                    <Table.Body key={post._id} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>
                          <img
                            src={post.postImage}
                            alt='user'
                            className='w-14 h-10 rounded-md bg-gray-500'
                          />
                        </Table.Cell>
                        <Table.Cell className='w-96'>{post.title}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
              <Button color="gray" pill>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
               </Button>
        
            </div>
          </div>
        </div>
      );
}
