import Head from 'next/head';
import { initializeApollo } from '../lib/client';
import { TasksDocument, TasksQuery, TaskStatus, useTasksQuery } from '../generated/graphql-frontend';
import { List, ListItem, ListIcon, Spinner, Container } from '@chakra-ui/react';
import { BsCheckCircleFill, BsPencil } from 'react-icons/bs';

export default function Home() {
  const result = useTasksQuery();
  const tasks = result.data?.tasks;

  return (
    <>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
			<Container>
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
              <ListIcon
								as={task.status === TaskStatus.Completed ? BsCheckCircleFill : BsPencil}
								color={task.status === TaskStatus.Completed ? 'green.300' : 'blue.500'} />
              {task.title}
            </ListItem>
          );
        })}
        </List>
        : <p>No tasks added in your list</p>
      }
			</Container>
    </>
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
