import React from 'react';
import { List } from '@chakra-ui/react';
import { Task } from '../../generated/graphql-frontend';
import TaskItem from '../TaskItem';

interface Props {
	list: Task[]
}


const TaskList = ({
	list
} : Props) => {
	return (
		<List spacing={3} display='flex' alignContent='space-between' w='100%' flexDirection='column'>
			{list.map((task) => {
				return (
					<TaskItem key={task.id} task={task} />
				);
			})
		}
	</List>	)
}

export default TaskList;
