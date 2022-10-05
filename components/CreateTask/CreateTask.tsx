
import {
	Button,
	FormControl,
	FormErrorIcon,
	FormErrorMessage,
	FormLabel,
	Input,
	SimpleGrid,
	Alert,
	AlertIcon,
	AlertDescription
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdErrorOutline } from 'react-icons/md'
import { FaSave } from 'react-icons/fa';
import { useCreateTaskMutation } from "../../generated/graphql-frontend";

interface Props {
  onSuccess: () => void;
}

const CreateTask = ({
	onSuccess
}: Props) => {

	const [task, setTask] = useState('');
	const [errorTask, setErrorTask] = useState(false);

	const onChangeTask = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTask(e.target.value);
	}

	const [createTask, { loading, error }] = useCreateTaskMutation({
    onCompleted: () => {
      setTask('');
			onSuccess();
    },
  });

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!loading) {
			try {
				await createTask({
					variables: {
						input: {
							title: task
						}
					}
				});
			} catch (error) {
				console.error(error);
				setErrorTask(true);
			}			
		}
	}

	let errorMessage = '';
	if(error) {
		if (error.networkError) {
			errorMessage = "A network error occurred"
		} else {
			errorMessage = error.graphQLErrors.toString();
		}
	}

	return <SimpleGrid w='100%'>
		{error && <Alert>
			<AlertIcon />
			<AlertDescription>{errorMessage}</AlertDescription>
		</Alert>}
		<form onSubmit={onSubmit}>
			<FormControl isInvalid={errorTask}>
				<FormLabel>Task</FormLabel>
				<Input
					name="task-input"
					placeholder="Type your task with a description"
					onChange={onChangeTask}
					value={task}
					autoComplete='false'
					onFocus={() => {
						setErrorTask(false);
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
