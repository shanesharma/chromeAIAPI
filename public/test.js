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
        
      }
      



      const params = await LanguageModel.params();
      try {
        let req = document.getElementById("prompt").value;
        
        
        

        const referenceImage = document.getElementById("referenceImage");
        const session = await LanguageModel.create({
    expectedInputs: [
        { type: "text", languages: ["en" /* system prompt */,] },
        { type: "image" }
      ],
      expectedOutputs: [
        { type: "text", languages: ["en"] }
        ]
        ,
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
              { type: "text", value: req },
              { type: "image", value: referenceImage }
            ],
          },
        ]);

        for await(const chunk of result){
        document.getElementById("output").textContent += chunk;
        }
        const { inputQuota, inputUsage } = session
        document.getElementById("output").textContent += inputUsage ;

      } catch (err) {
        document.getElementById("output").textContent = "Error: " + err;
      }
    });