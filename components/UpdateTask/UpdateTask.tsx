import { Button,
	FormControl,
	FormErrorIcon,
	FormErrorMessage,
	FormLabel,
	Input,
	SimpleGrid,
	Container,
	Grid,
	Alert,
	AlertDescription,
	AlertIcon
} from '@chakra-ui/react';
import { MdErrorOutline } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import React, { useState } from 'react';
import { useUpdateTaskMutation } from '../../generated/graphql-frontend';
import { isApolloError } from '@apollo/client';
import { useRouter } from 'next/router';

interface Props {
	id: number;
	initialValues: Values;
}

interface Values {
	title: string;
}

const UpdateTask: React.FC<Props> = ({
	id,
	initialValues
}: Props) => {
	const [value, setValue] = useState<Values>(initialValues);
	const [errorTask, setErrorTask] = useState(false);
	const router = useRouter();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value} = e.target;
		setValue(prev => ({
			...prev,
			[name]: value
		}));
	}

	const [ updateTask, { loading, error } ] = useUpdateTaskMutation();

	const onUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!loading) {
			try {
				const res = await updateTask({
					variables: {
						input: {
							id: id,
							title: value.title
						}
					}
				});
				console.log('res', res);
				
				//if (res.data?.updateTask) {
				//	router.push('/');
				//}
			} catch(error) {
				setErrorTask(true);
			}	
		}
	}

	let errorMessage: string | React.ReactNode = '';
	if(error) {
		if (error.networkError) {
			errorMessage = "A network error occurred"
		} else {
			const listErrors = error.graphQLErrors.map(err => <li key={err.toString()}>{err.message}</li>)
			errorMessage = <ul>{listErrors}</ul>;
		}
	}

	return (
		<Container>
			<Grid>
				<SimpleGrid w='100%'>
					{error && <Alert>
						<AlertIcon />
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>}
					<form onSubmit={onUpdate}>
						<FormControl
							isInvalid={errorTask}
						>
							<FormLabel>Task</FormLabel>
							<Input
								name="title"
								placeholder="Type your task with a description"
								onChange={onChange}
								value={value.title}
								autoComplete='false'
								onFocus={() => {
									setErrorTask(false);
								}}
							/>
							{error && <FormErrorMessage>
								<FormErrorIcon as={MdErrorOutline} />
								Error in update form
							</FormErrorMessage>}
						</FormControl>
						<FormControl py='1em'>
							<Button
								leftIcon={<FaSave />}
								type="submit"
								colorScheme='blue'
								disabled={loading}
							>
								Save
							</Button>
						</FormControl>
					</form>
				</SimpleGrid>
			</Grid>
		</Container>
	)
}

export default UpdateTask