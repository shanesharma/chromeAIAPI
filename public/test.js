import * as funcs from "./helper.js"


 async function writerAI(tone, length,context, req)
 {
  if(!('Writer' in self))
  {
    return 0;
  }

  const availability = await Writer.availability();

  if (availability == "downloadable")
      {
        document.getElementById("output").textContent  = "Downloading the promptAPI model";
        const session = await LanguageModel.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              document.getElementById("output").textContent  = "Downloading the promptAPI model\n" + e + "%";

            });
          },
        });
        return 0;
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

      const result = await Writer.create({tone: tone, format:'plain-text', length: length});
      
      const stream  = await result.write(req, {context: context});
      return stream; 
 }
 async function promptAI()
    {
      const availability = await LanguageModel.availability();
      const params = await LanguageModel.params();
      if (availability == "downloadable")
      {
        document.getElementById("output").textContent  = "Downloading the promptAPI model";
        const session = await LanguageModel.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              document.getElementById("output").textContent  = "Downloading the promptAPI model\n" + e + "%";

            });
          },
        });
        return 0;
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
        return session;
    }


document.getElementById("output").textContent  = " ";
    document.getElementById("run").addEventListener("click", async () => {
      
      console.log("running prompt");



        
        try {
          let req = document.getElementById("prompt").value;
          const functions = await fetch("./Untitled document.txt");
          const text_ouput = await functions.text()

         
        
         const prompt_session = await promptAI();
         //const writer_session = await writerAI();
         
          
          const referenceImage = document.getElementById("referenceImage");
          
/*       
        const result = await prompt_session.promptStreaming([
          {
            role: "assistant",
            content: [
              { type: "text", value: `-GUIDELINES-
                                      1.
1. Match the request to the most suitable function from the list.  
 2. Return only "funcs." followed by the function call with the user’s request or parameters inserted.  
 3. Do not include extra formatting, quotes, or explanations. Assume the output is piped into a terminal.  
4. If the request is vague or doesn’t match any function, output exactly: funcs.makeInputAlert("Invalid request detected")
5. If the keyword 'el' is used in a function, it must be replaced with a user requested parameter
Below is the list of the possible functions `},
              { type: "text", value: text_ouput },
              
              { type: "text", value: req},
            ],
          },
        ]);

 */

          const result = await prompt_session.promptStreaming([
          {
            role: "assistant",
            content: [
              { type: "text", value: "User request: " +req +  " User request ended: " },
              { type: "text", value: `<GUIDELINES>

<decision_hierarchy>
Execute in order to the first applies

-The user explictly stated they want generation requested: jump to <text_generation> 
-The following request is either invalid or unsupported jump to <error_handling>
</decision_hierrchy>

<text_generation>
	<parameters>
		-length (MANDATORY INPUT): determine if variable should be ‘short’, ‘medium’ or ‘long’ based on users request.
		-tone (MANDATORY INPUT): determine if variable should be ‘formal’, ‘neutral’ or ‘casual’ based on users request. 
		-context (MANDATORY INPUT): background context that may be determined based from users request
	</parameters>
Take the required inputs from parameters and repeat the field:
 const a = await writerAI(tone, length, context, req);
document.getElementById("output").textContent  = a;
</text_generation> 


<error_handling>
<parameters>
-str (MANDATORY INPUT): interpret the reason why the error_handling was called: ensure that message is encapsulated with “”
</parameters> 
-take the required input from<parameters> and repeat the field: 
funcs.makeInputAlert(str);
</error_handling> 
</GUIDELINES>
`},
              
              
              
            ],
          },
        ]);
        
        for await(const chunk of result){
        document.getElementById("output").textContent += chunk;
        }
        
        //document.getElementById("output").textContent += inputUsage ;
        eval(document.getElementById("output").textContent);
      } catch (err) {
        document.getElementById("output").textContent += "Error: " + err;
      }
       
    });

   