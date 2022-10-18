import Link from 'next/link';
import React from 'react'

const Filter = () => {
	return (
		<div>
			<ul>
				<li><Link href='/' scroll={false}><a>All</a></Link></li>
				<li><Link href='/[status]' as={'/active'} scroll={false} shallow={true}><a>Active</a></Link></li>
				<li><Link href='/[status]' as={'/completed'} scroll={false} shallow={true}><a>Complete</a></Link></li>
			</ul>
		</div>
	)
}

export default Filter;
