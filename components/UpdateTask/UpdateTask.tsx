import { Button, FormControl, FormErrorIcon, FormErrorMessage, FormLabel, GridItem, Input, SimpleGrid, Container, Grid } from '@chakra-ui/react';
import { MdErrorOutline } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import React, { useState } from 'react';

interface Props {
	initialValues: Values;
}

interface Values {
	title: string;
}

const UpdateTask: React.FC<Props> = ({
	initialValues
}: Props) => {
	const [value, setValue] = useState<Values>(initialValues);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value} = e.target;
		setValue(prev => ({
			...prev,
			[name]: value
		}));
	}

	const onUpdate = () => {

	}

	return (
		<Container>
			<Grid>
				<SimpleGrid w='100%'>
					<form onSubmit={onUpdate}>
						<FormControl 
							
						>
							<FormLabel>Task</FormLabel>
							<Input
								name="title"
								placeholder="Type your task with a description"
								onChange={onChange}
								value={value.title}
								autoComplete='false'
								onFocus={() => {
									//setErrorTask(false);
								}}
							/>
							{/*error && <FormErrorMessage>
								<FormErrorIcon as={MdErrorOutline} />
								Your task must not to be empty
							</FormErrorMessage>*/}
						</FormControl>
						<FormControl py='1em'>
							<Button leftIcon={<FaSave />} type="submit" colorScheme='blue'>
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