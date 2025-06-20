function createTimeline(element, objects){
    element.innerHTML = '';
    let html = '<div class="relative">';
    let lastIndex = objects.length - 1;
    objects.forEach((object, index) => {
        const isLast = index == lastIndex;

        if(object.state == 'finished') object.dotColor = 'bg-red-500';
        else if(object.state == 'started') object.dotColor = 'bg-gray-200';
        else object.dotColor = 'bg-gray-200';

        if(object.state == 'finished') object.lineColor = object.dotColor;
        else if(object.state == 'started') object.lineColor = object.dotColor;
        else object.lineColor = 'bg-gray-200';


        if(!isLast) html += `
                <div class="flex flex-col">

                    <div class="relative pl-10 mb-3">

                        <div>
                            <div class="absolute top-1/2 left-2.5 w-0.5 h-[calc(50%+40px)] ${object.lineColor}"></div>
                            <div class="absolute top-1/2 -translate-y-1/2 w-4 h-4 ${object.dotColor} rounded-full left-[3px]"></div>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${object.date}</p>
                            <p class="font-medium">${object.event}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">${object.description}</p>
                        </div>

                    </div>

                </div>
            `;
        else html += `
                <div class="flex flex-col">

                    <div class="relative pl-10">

                        <div>
                            <div class="absolute top-1/2 -translate-y-1/2 w-4 h-4 ${object.dotColor} rounded-full left-[3px]"></div>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${object.date}</p>
                            <p class="font-medium">${object.event}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">${object.description}</p>
                        </div>

                    </div>

                </div>
        `;
    });
    html += '</div>';
    element.innerHTML = html;
}