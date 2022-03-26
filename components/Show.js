import React from 'react'

const Show = ({ goback, title, timeslot, category, dj, image, description }) => {
  return (
    <tr
      className="transition duration-300 ease-in-out hover:bg-[#161c22]"
      onClick={goback}>

      <td className="m-2 flex flex-col">
        <img className="rounded hidden md:block"
          src={image} alt="Show Pic">
        </img>
      </td>

      <td className="align-top">

        <ul className="mt-4 ml-4">
          <li className="mb-3 text-center font-bold">{title}</li>
          <li className="">{timeslot}</li>
          <li className="">Catergory: {category}</li>
          <li className="mt-3">{description}</li>
        </ul>
      </td>

      <td className="text-center align-top">
        <div className="mt-4">
          <span className="">{dj}</span>
        </div>
      </td>

    </tr>
  )
}

export default Show
