import Head from 'next/head';
import { initializeApollo } from '../lib/client';
import { TasksDocument, TasksQuery, TaskStatus, useTasksQuery, TasksQueryVariables } from '../generated/graphql-frontend';
import { Spinner, Container, Grid, GridItem } from '@chakra-ui/react';
import CreateTask from '../components/CreateTask';
import React, { useEffect, useRef, useState } from 'react';
import TaskList from '../components/TaskList';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { GetServerSideProps } from 'next';
import Filter from '../components/Filter';

const isTaskStatus = (value: string): value is TaskStatus => Object.values(TaskStatus).includes(value as TaskStatus)

export default function Home() {
	const router = useRouter();
	const status = typeof router.query.status === 'string' ? router.query.status : undefined;
	if (status !== undefined && !isTaskStatus(status)) {
		return <Error statusCode={404} />
	}
  const prevStatus = useRef(status);
	useEffect(() => {
		prevStatus.current = status;
	}, [status])
	const result = useTasksQuery({
		variables: {
			status
		},
		fetchPolicy: prevStatus.current === status ? 'cache-first' : 'cache-and-network'
	});
	const [data, setData] = useState<{
    __typename?: "Task" | undefined;
    id: number;
    title: string;
    status: TaskStatus;
	}[]>();

	useEffect(() => {
		const tasks = result.data?.tasks as {
			__typename?: "Task" | undefined;
			id: number;
			title: string;
			status: TaskStatus;
		}[];
		console.log('result', result);
		
		console.log('data', data);
		
		setData(tasks);
	}, []);	

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
					result.loading && !data ? (
						<Spinner size='xl' />
					) : result.error ? (
						<p>Error</p>
					) : data &&
					data.length > 0 ?
						<TaskList list={data} />
						: <p>No tasks added in your list</p>
					}
						<Filter />
					</GridItem>
				</Grid>
			</Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const status = typeof context.params?.status === 'string' ? context.params?.status : undefined;

	if (status === undefined || isTaskStatus(status)) {
		const apolloClient = initializeApollo();

		await apolloClient.query<TasksQuery, TasksQueryVariables>({
			query: TasksDocument,
			variables: {
				status
			}
		});
	
		return {
			props: {
				initialApolloState: apolloClient.cache.extract(),
			},
		};
	}

	return {
		props: {}
	}
};
