import Link from 'next/link';
import React from 'react'
import { TaskStatus } from '../../generated/graphql-frontend';

interface Props {
	status: TaskStatus;
}

const Filter = () => {
	return (
		<div>
			<ul>
				<li><Link href='/' scroll={false} shallow={true}><a>All</a></Link></li>
				<li><Link href='/[status]' as={'/active'} scroll={false} shallow={true}><a>Active</a></Link></li>
				<li><Link href='/[status]' as={'/completed'} scroll={false} shallow={true}><a>Complete</a></Link></li>
			</ul>
		</div>
	)
}

export default Filter;
