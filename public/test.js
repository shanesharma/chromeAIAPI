import * as funcs from "./helper.js"



document.getElementById("output").textContent  = " ";
    document.getElementById("run").addEventListener("click", async () => {
      const availability = await LanguageModel.availability();
      if (availability == "downloadable")
      {
        document.getElementById("output").textContent  = "Downloading the promptAPI model";
        const session = await LanguageModel.create({
          monitor(m) {
            m.addEvenetListener('downloadprogress', (e) => {
              document.getElementById("output").textContent  = "Downloading the promptAPI model\n" + e + "%";

            });
          },
        });
      }
      else if(availability == "downloading")
      {
        document.getElementById("output").textContent  = "Currently downloading";
      }

      else if(availability == "unavailable")
      {
        document.getElementById("output").textContent  = "Session Unavailable on your device";
        return 0;
      }
      console.log("running prompt");



        const params = await LanguageModel.params();
        try {
          let req = document.getElementById("prompt").value;
          const functions = await fetch("./Untitled document.txt");
          const text_ouput = await functions.text()

         
        

          const referenceImage = document.getElementById("referenceImage");
          const session = await LanguageModel.create({
          expectedInputs: [
            { type: "text", languages: ["en" /* system prompt */,] },
            { type: "image" }
          ],
          expectedOutputs: [
            { type: "text", languages: ["en"] }
          ],
          temperature: .4,

        topK: params.defaultTopK,
        });
        //summarizer code
       /*const summarizer_options = (context,stype, sformat, slength) => {return {
            sharedContext: context, type: stype, format:sformat, length:slength }};
       const myConfig = summarizer_options("Essay about Franz Kafka", 'key-points', 'markdown', 'medium')
            const summarizer = await Summarizer.create(myConfig);
        */
        
        const result = await session.promptStreaming([
          {
            role: "user",
            content: [
              { type: "text", value: text_ouput },
              { type: "text", value: `1. Match the request to the most suitable function from the list.  
                                      2. Return only "funcs." followed by the function call with the user’s request or parameters inserted.  
                                      3. Do not include extra formatting, quotes, or explanations. Assume the output is piped into a terminal.  
                                      4. If the request is vague or doesn’t match any function, output exactly: 
                                         Unsure of what to output please specify: user response will be submitted after this text
                                      5. If the keyword 'el' is used in a function, it must be replaced with a user requested parameter`},
              { type: "text", value: req},
              { type: "image", value: referenceImage }
            ],
          },
        ]);

        for await(const chunk of result){
        document.getElementById("output").textContent += chunk;
        }
        const { inputQuota, inputUsage } = session
        //document.getElementById("output").textContent += inputUsage ;
        eval(document.getElementById("output").textContent);
      } catch (err) {
        document.getElementById("output").textContent += "Error: " + err;
      }
    });