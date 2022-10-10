import React, { useEffect } from 'react';
import { Task, TaskStatus, useDeleteTaskMutation } from '../../generated/graphql-frontend';
import { ListItem, ListIcon, Flex, Icon, IconButton } from '@chakra-ui/react';
import { BsCheckCircleFill, BsPencil, BsLink, BsFillXCircleFill } from 'react-icons/bs';
import Link from 'next/link';
import { Reference } from '@apollo/client';

interface Props {
	task: Task;
}

const TaskItem = ({
	task
} : Props) => {
	const [ deleteTask, {
		loading,
		error,
	} ] = useDeleteTaskMutation({
		variables: {
			id: task.id
		},
		errorPolicy: 'all',
		update: (cache, result) => {
			const deletedTask = result.data?.deleteTask;
			if (deletedTask) {
				cache.modify({
					fields: {
						tasks(tasksRef: Reference[], {
							readField
						}) {
							return tasksRef.filter(taskRef => {
								return readField('id', taskRef) !== deletedTask.id
							})
						}
					}
				});
			}
		}
	});

	useEffect(() => {
		if(error) {
			alert('An error occurred');
		}
	}, [error])
	

	const onClickDeleteTask = async (e: React.MouseEvent<HTMLElement>) => {
		try {
			await deleteTask();
		} catch(err) {
			console.error(err);
		}
	}

	return (
		<ListItem display='flex' flexDirection='row' alignContent='center' >
				<ListIcon
					as={task.status === TaskStatus.Completed ? BsCheckCircleFill : BsPencil}
					color={task.status === TaskStatus.Completed ? 'green.300' : 'blue.500'} />
				<Link href="/update/[id]" as={`/update/${task.id}`} style={{
					cursor: 'pointer'
				}}>
					<Icon as={BsLink} color={'blackAlpha.600'} />
				</Link>
				<span>{task.title}</span>
				<IconButton
					justifySelf='end'
					onClick={onClickDeleteTask}
					disabled={loading}
					color='red.400'
					icon={<BsFillXCircleFill />}
					aria-label="delete" />
		</ListItem>	)
}

export default TaskItem