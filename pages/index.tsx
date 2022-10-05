import Head from 'next/head';
import { initializeApollo } from '../lib/client';
import { TasksDocument, TasksQuery, TaskStatus, useTasksQuery } from '../generated/graphql-frontend';
import { List, ListItem, ListIcon, Spinner, Container, Grid, GridItem, Icon } from '@chakra-ui/react';
import { BsCheckCircleFill, BsPencil, BsLink } from 'react-icons/bs';
import CreateTask from '../components/CreateTask';
import React from 'react';
import Link from 'next/link';

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
				<Grid>
					<GridItem w='100%'>
						<CreateTask onSuccess={result.refetch} />
					</GridItem>
					<GridItem w='100%'>
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
										<Link href="/update/[id]" as={`/update/${task.id}`} style={{
											cursor: 'pointer'
										}}>
											<Icon as={BsLink} color={'blackAlpha.600'} />
										</Link>
									{task.title}
								</ListItem>
							);
						})}
						</List>
						: <p>No tasks added in your list</p>
					}
					</GridItem>
				</Grid>
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
