import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { initializeApollo } from '../lib/client';
import { TasksDocument, TasksQuery, TaskStatus, useTasksQuery } from '../generated/graphql-frontend';
import { List, ListItem, ListIcon, Spinner } from '@chakra-ui/react';
import { MdCheckCircle,  } from 'react-icons/md';
import { BsCheckCircleFill, BsPencil } from 'react-icons/bs';

export default function Home() {
  const result = useTasksQuery();
  const tasks = result.data?.tasks;

  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        result.loading ? (
          <Spinner size='xl' />
        ) : result.error ? (
          <p>Error</p>
        ) : tasks &&
        tasks.length > 0 ?
        <List>
          {tasks.map((task) => {
          return (
            <ListItem key={task.id}>
              <ListIcon as={task.status === TaskStatus.Completed ? BsCheckCircleFill : BsPencil} />
              {task.title}
            </ListItem>
          );
        })}
        </List>
        : <p>No tasks added in your list</p>
      }
    </div>
  );
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query<TasksQuery>({
    query: TasksDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
