import { ArrowRightEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Timeline(props) {
  const { timeline } = props;
  if (timeline.length === 0) {
    return null
  }

  const timelineFormatted = timeline.map((event, idx) => {
    let icon;
    if (event.type === "Entrada") {
      icon = ArrowRightEndOnRectangleIcon;
    } else if (event.type === "Salida") {
      icon = ArrowLeftStartOnRectangleIcon;
    } else {
      icon = XMarkIcon;
    }
    let iconBackground;
    if (event.type === "Entrada") {
      iconBackground = "bg-green-500";
    } else if (event.type === "Salida") {
      iconBackground = "bg-blue-500";
    } else {
      iconBackground = "bg-red-500";
    }
    return {
      icon: icon,
      iconBackground: iconBackground,
      ...event,
    }
  })

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timelineFormatted.map((event, eventIdx) => (
          <li key={event.hour}>
            {console.log(event)}
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      event.iconBackground,
                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                    )}
                  >
                    <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event["type"]}{' '}
                      {event.wfh ? (
                        <span className="font-medium text-gray-900">desde casa</span>
                      ) : (
                        <span className="font-medium text-gray-900">en la oficina</span>
                      )}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {event.time}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
