
import { Button, FormControl, FormErrorIcon, FormErrorMessage, FormLabel, Icon, IconButton, Input, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { MdErrorOutline } from 'react-icons/md'
import { FaSave } from 'react-icons/fa';
import { useCreateTaskMutation } from "../../generated/graphql-frontend";

const CreateTask = () => {

	const [task, setTask] = useState('');
	const [error, setError] = useState(false);

	const onChangeTask = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTask(e.target.value);
	}

	const [createTask] = useCreateTaskMutation();

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await createTask({
				variables: {
					input: {
						title: task
					}
				}
			});
			console.log('res', res);
			
		} catch (error) {
			console.error(error);
			setError(true);
		}
	}

	
	return <SimpleGrid w='100%'>
		<form onSubmit={onSubmit}>
			<FormControl isInvalid={error}>
				<FormLabel>Task</FormLabel>
				<Input
					placeholder="Type your task with a description"
					onChange={onChangeTask}
					value={task}
					onFocus={() => {
						setError(false);
					}}
				/>
				{error && <FormErrorMessage>
					<FormErrorIcon as={MdErrorOutline} />
					Your task must not to be empty
				</FormErrorMessage>}
			</FormControl>
			<FormControl py='1em'>
				<Button leftIcon={<FaSave />} type="submit" colorScheme='blue'>
					Save
				</Button>
			</FormControl>
		</form>
	</SimpleGrid>
}

export default CreateTask;
