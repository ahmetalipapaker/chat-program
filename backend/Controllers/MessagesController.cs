using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class MessagesController : ControllerBase
{
    private readonly DataContext _context;
    private readonly HttpClient _httpClient;

    public MessagesController(DataContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
    {
        return await _context.Messages.OrderBy(m => m.Timestamp).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Message>> PostMessage([FromBody] Message message)
    {
        message.Timestamp = DateTime.UtcNow;

        try
        {
            var aiRequest = new { text = message.Text };
            var response = await _httpClient.PostAsJsonAsync("http://localhost:7860/analyze", aiRequest);

            if (response.IsSuccessStatusCode)
            {
                var aiResult = await response.Content.ReadFromJsonAsync<AiResponse>();
                if (aiResult != null)
                {
                    message.Sentiment = aiResult.label;
                    message.SentimentScore = aiResult.score;
                    Console.WriteLine($"AI Response: {message.Sentiment}, Score: {message.SentimentScore}");
                }
            }
            else
            {
                message.Sentiment = "Unknown";
                message.SentimentScore = 0;
            }
        }
        catch (Exception ex)
        {
            message.Sentiment = "Unknown";
            message.SentimentScore = 0;
            Console.WriteLine($"AI Response exception: {ex.Message}");
        }

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMessages), new { id = message.Id }, message);
    }

    class AiResponse
    {
        public string label { get; set; } = "";
        public double score { get; set; }
    }
}
